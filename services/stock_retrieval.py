import requests
import pandas as pd
from datetime import date, datetime, timedelta

def date_today():
    return date.today().strftime("%Y-%m-%d")

def historical_prices(stock_symbol, start_date, end_date):
    api_key = "2Q8AT87UOUTGOPGY"
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock_symbol}&apikey={api_key}"
    
    response = requests.get(url)
    data = response.json()
    
    time_series = data['Time Series (Daily)']
    
    dict_name = stock_symbol + "_prices"
    closing_prices = {}

    # Convert strings to datetime objects
    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')

    # Initialize last known price
    last_known_price = None

    # Iterate over each date in the range
    delta = timedelta(days=1)
    while start_date <= end_date:
        date_str = start_date.strftime('%Y-%m-%d')
        if date_str in time_series:
            last_known_price = float(time_series[date_str]['4. close'])
        if last_known_price is not None:
            closing_prices[date_str] = last_known_price
        start_date += delta

    return {dict_name: closing_prices}

def roi(stock_symbol, start_date):
    todays_date = date_today()

    historical = historical_prices(stock_symbol, start_date, todays_date)    

    initial_value = historical[start_date]
    final_value = historical[todays_date]
    
    roi_percentage = ((final_value - initial_value) / initial_value) * 100
    
    return roi_percentage

print(historical_prices("GOOGL", "2020-07-25", "2024-02-20"))