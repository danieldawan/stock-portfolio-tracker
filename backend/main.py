import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def portfolio():
    # Load portfolio data from JSON file
    with open("portfolio.json") as json_file:
        data = json.load(json_file)
    return data

def get_latest_closing_price(ticker):
    apikey = "2Q8AT87UOUTGOPGY"
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol={ticker}&apikey={apikey}"
    response = requests.get(url)
    data = response.json()
    latest_week = list(data["Weekly Time Series"].keys())[0]
    latest_close_price = data["Weekly Time Series"][latest_week]["4. close"]
    return float(latest_close_price)

@app.route('/', methods=["GET"])
def homepage():
    # Get client stocks from portfolio
    client_stocks = portfolio()
    stock_dict = {}

    # Create a dictionary of stock tickers and quantities
    for item in client_stocks["portfolios"][0]["items"]:
        stock_dict[item["ticker"]] = item["quantity"]
    return stock_dict

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

@app.route('/total-portfolio-value', methods=["GET"])
def total_portfolio_value():
    client_stocks = portfolio()
    total_value = 0

    for item in client_stocks["portfolios"][0]["items"]:
        ticker = item["ticker"]
        quantity = item["quantity"]
        try:
            latest_close_price = get_latest_closing_price(ticker)
            total_value += latest_close_price * quantity
        except Exception as e:
            print(f"Error fetching data for {ticker}: {str(e)}")
            return jsonify({"error": f"Error fetching data for {ticker}"}), 500

    return jsonify({"total_portfolio_value": total_value})

if __name__ == "__main__":
    app.run(debug=True)
