import requests
import json
import sys

def test_admin_endpoints():
    base_url = "https://app-irwodrad.fly.dev"
    
    # Login to get token
    login_data = {
        "email": "admin@opencreator.dev",
        "password": "Admin123!"
    }
    
    response = requests.post(f"{base_url}/auth/login", json=login_data)
    if response.status_code != 200:
        print(f"Login failed with status {response.status_code}")
        sys.exit(1)
        
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test admin endpoints
    endpoints = [
        "/admin/users",
        "/admin/dashboard/stats"
    ]
    
    for endpoint in endpoints:
        response = requests.get(f"{base_url}{endpoint}", headers=headers)
        print(f"\nTesting {endpoint}")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    test_admin_endpoints()
