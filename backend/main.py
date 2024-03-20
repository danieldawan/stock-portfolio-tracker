from flask import Flask, jsonify
import requests
import oracledb
import os
from flask_cors import CORS
from flask import request, jsonify, session
from models import db, User, Stock
from sqlalchemy.pool import NullPool
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

app = Flask(__name__)
app.secret_key = '156673d0aadd4b35e899d59664edd52f'
CORS(app, supports_credentials=True)

un = 'ADMIN'
pw = 'CapstoneProject1'
dsn = '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g933e120a918fb4_stockportfoliotracker_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'

pool = oracledb.create_pool(user=un, password=pw,
                            dsn=dsn)

app.config['SQLALCHEMY_DATABASE_URI'] = 'oracle+oracledb://'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': pool.acquire,
    'poolclass': NullPool
}
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)

#with app.app_context():
    #db.create_all()

#Finding the latest closing price for a given ticker (not user tied)
def get_latest_closing_price(ticker):
    apikey = "2Q8AT87UOUTGOPGY"
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol={ticker}&apikey={apikey}"
    response = requests.get(url)
    data = response.json()
    latest_week = list(data["Weekly Time Series"].keys())[0]
    latest_close_price = data["Weekly Time Series"][latest_week]["4. close"]
    return float(latest_close_price)

#Return a JSON with the stocks of a given user, where the json is structured as ticker:quantity
@app.route('/portfolio/<username>', methods=["GET"])
def homepage(username):
    user = User.query.filter_by(username=username).first()
    if user:
        stocks_list = [
            {
                "ticker": stock.ticker,
                "quantity": stock.quantity
            } for stock in user.stocks.all()
        ]
        return jsonify(stocks_list)
    return jsonify({"message": "User not found"}), 404

#Return the weekly time series of a given ticker and the percentage change (not user tied)
@app.route('/<ticker>', methods=["GET"])
def ticker_info(ticker):
    try:
        apikey = "2Q8AT87UOUTGOPGY"
        stock = ticker
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol={stock}&apikey={apikey}"
        
        # Make API request to get stock information
        response = requests.get(url)
        data = response.json()
        stock_info = data["Weekly Time Series"]
        
        # Select the first 10 items from the stock information
        selected_items = list(stock_info.items())[:10]
        stock_info = dict(selected_items)
        
        # Calculate percentage change
        latest_week_key = list(stock_info.keys())[0]
        previous_week_key = list(stock_info.keys())[1]
        latest_close = float(stock_info[latest_week_key]["4. close"])
        previous_close = float(stock_info[previous_week_key]["4. close"])
        percent_change = ((latest_close - previous_close) / previous_close) * 100
        
        return jsonify({"stock_info": stock_info, "percent_change": percent_change})

    except Exception as e:
        print(str(e))
        return {"error": "Failed to fetch ticker information"}, 500

#Return the total portfolio value of a given user
@app.route('/total-portfolio-value/<username>', methods=["GET"])
def total_portfolio_value(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.stocks.count() == 0:
        return jsonify({"error": "User has no stocks"}), 404

    total_value = 0
    for stock in user.stocks.all():
        try:
            latest_close_price = get_latest_closing_price(stock.ticker)
            total_value += latest_close_price * stock.quantity
        except Exception as e:
            continue
    
    return jsonify({"total_portfolio_value": total_value})

#Return the percentage change of the total portfolio value of a given user for the past 10 weeks
@app.route('/portfolio-value-and-stock-prices/<username>', methods=["GET"])
def portfolio_value_and_stock_prices(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.stocks.count() == 0:
        return jsonify({"error": "User has no stocks"}), 404

    portfolio_values_by_date = {}
    individual_stock_closing_prices = {}

    for stock in user.stocks.all():
        apikey = "2Q8AT87UOUTGOPGY"
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol={stock.ticker}&apikey={apikey}"

        try:
            response = requests.get(url)
            data = response.json()
            weekly_data = data["Weekly Adjusted Time Series"]

            stock_prices = []

            # Iterate over the last 10 weeks
            for week in list(weekly_data.keys())[:10]:
                if week not in portfolio_values_by_date:
                    portfolio_values_by_date[week] = 0
                weekly_close_price = float(weekly_data[week]["4. close"])
                portfolio_values_by_date[week] += weekly_close_price * stock.quantity

                # Add the weekly closing price for the current stock
                stock_prices.append({"date": week, "closing_price": weekly_close_price})

            # Add the stock prices to the individual stock closing prices dictionary
            individual_stock_closing_prices[stock.ticker] = stock_prices

        except Exception as e:
            print(f"Error fetching data for {stock.ticker}: {e}")

    # Sort the total portfolio values by date and prepare the final response
    total_portfolio_values_sorted = [{"date": date, "total_portfolio_value": value} for date, value in sorted(portfolio_values_by_date.items())]
    final_response = {
        "total_portfolio_value_over_time": total_portfolio_values_sorted,
        "individual_stock_closing_prices": individual_stock_closing_prices
    }

    return jsonify(final_response)

#Add or update stock to a user's portfolio
@app.route('/add-stock/<username>/<string:stock>/<int:quantity>', methods=["POST"])
def add_stock(username, stock, quantity):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    try:
        # Using get_latest_closing_price to check if the stock ticker is valid
        get_latest_closing_price(stock)
    except Exception as e:
        return jsonify({"error": f"Invalid or inaccessible stock ticker: {stock}"}), 400

    existing_stock = Stock.query.filter_by(user_id=user.id, ticker=stock).first()
    if existing_stock:
        existing_stock.quantity += quantity
    else:
        new_stock = Stock(ticker=stock, quantity=quantity, user_id=user.id)
        db.session.add(new_stock)

    db.session.commit()

    return jsonify({"message": f"{quantity} units of stock {stock} added for user {username}"})

#Remove stock from a user's portfolio
@app.route('/remove-stock/<string:username>/<string:stock>', methods=["DELETE"])
def remove_stock(username, stock):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    stock_to_remove = Stock.query.filter_by(user_id=user.id, ticker=stock).first()
    if stock_to_remove:
        db.session.delete(stock_to_remove)
        db.session.commit()
        return jsonify({"message": f"Stock {stock} removed for user {username}"})
    else:
        return jsonify({"error": "Stock not found"}), 404

#Create a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already in use"}), 409
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already in use"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password_hash=hashed_password, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

#Log in a user
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Find user by username
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        session['user_id'] = user.id  # Store user ID in session for logged-in state
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

#Logout a user
@app.route('/logout', methods=["GET"])
def logout():
    session.pop('user_id', None)  # Remove the user_id from session
    return jsonify({"message": "Logout successful"}), 200

if __name__ == "__main__":
    app.run(debug=True)
