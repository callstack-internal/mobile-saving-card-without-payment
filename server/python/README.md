# Saving cards without payment

## Requirements

- Python 3
- [Configured .env file](../README.md)

## How to run

1. Create and activate a new virtual environment

**On Linux / Unix / MacOS**

```
python3 -m venv env
source env/bin/activate
```

**On Windows** (PowerShell)

```
python3 -m venv env
.\env\Scripts\activate.bat
```

2. Install dependencies

```
pip install -r requirements.txt
```

3. Export and run the application

**On Linux / Unix / MacOS**

```
export FLASK_APP=server.py
python3 -m flask run --port=4242
```

**On Windows** (PowerShell)

```
$env:FLASK_APP=“server.py"
python3 -m flask run --port=4242
```

