import sys
import json

def parse_token():
    try:
        data = json.load(sys.stdin)
        print(data['access_token'])
    except Exception as e:
        print(f"Error parsing token: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    parse_token()
