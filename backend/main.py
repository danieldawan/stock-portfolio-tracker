from flask import Flask, jsonify
import requests
import oracledb
import os
from flask_cors import CORS
from flask import request, jsonify, session
from models import db, User, Stock
from sqlalchemy.pool import NullPool
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

app = Flask(__name__)
app.secret_key = '156673d0aadd4b35e899d59664edd52f'
CORS(app)

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
    # db.create_all()

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
@app.route('/portfolio/<user_id>', methods=["GET"])
def homepage(user_id):
    # Query the User model to get the user by user_id
    user = User.query.filter_by(id=user_id).first()

    # Check if the user exists
    if user:
        # Construct a list of stocks owned by the user
        stocks_list = []
        for stock in user.stocks.all():  # Use .all() to execute the query and fetch the results
            stock_info = {
                "ticker": stock.ticker,
                "quantity": stock.quantity,
                "purchase_price": stock.purchase_price
            }
            stocks_list.append(stock_info)

        return jsonify(stocks_list)
    else:
        # Return an empty list or suitable message if the user does not exist
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
@app.route('/total-portfolio-value/<user_id>', methods=["GET"])
def total_portfolio_value(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.stocks.count() == 0:
        return jsonify({"error": "User has no stocks"}), 404

    total_value = 0
    for stock in user.stocks.all():  # Use .all() to fetch all Stock objects
        try:
            latest_close_price = get_latest_closing_price(stock.ticker)
            total_value += latest_close_price * stock.quantity
        except Exception as e:
            # Handle potential errors gracefully, perhaps logging them
            continue  # Optionally, decide how to handle individual stock errors

    return jsonify({"total_portfolio_value": total_value})

#Add or update stock to a user's portfolio
@app.route('/add-stock/<user_id>/<string:stock>/<int:quantity>', methods=["POST"])
def add_stock(user_id, stock, quantity):
    data = request.get_json()  # Extract the JSON payload from the request
    purchase_price = data.get('purchase_price')  # Extract the purchase_price from the JSON payload

    if purchase_price is None:  # Check if purchase_price is provided
        return jsonify({"error": "Purchase price is required"}), 400

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    existing_stock = Stock.query.filter_by(user_id=user_id, ticker=stock).first()
    if existing_stock:
        existing_stock.quantity += quantity
        # Optionally update the purchase_price here if needed
    else:
        new_stock = Stock(ticker=stock, quantity=quantity, purchase_price=purchase_price, user_id=user_id)
        db.session.add(new_stock)

    db.session.commit()

    return jsonify({"message": f"{quantity} units of stock {stock} added for user {user_id}"})

#Remove stock from a user's portfolio
@app.route('/remove-stock/<user_id>/<string:stock>', methods=["DELETE"])
def remove_stock(user_id, stock):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    stock_to_remove = Stock.query.filter_by(user_id=user_id, ticker=stock).first()
    if stock_to_remove:
        db.session.delete(stock_to_remove)
        db.session.commit()
        return jsonify({"message": f"Stock {stock} removed for user {user_id}"})
    else:
        return jsonify({"error": "Stock not found"}), 404

#Create a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Check if username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already in use"}), 409
    
    # Hash the password for security
    hashed_password = generate_password_hash(password)
    
    # Create a new user instance with the correct model attribute
    new_user = User(username=username, password_hash=hashed_password)
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