from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service = service)

driver.get("https://davelee-fun.github.io/")

element = driver.find_element(By.CSS_SELECTOR, "title")
print("text : ", element.text)
print("get_attribute : ", element.get_attribute("text"))

time.sleep(1)

driver.quit()