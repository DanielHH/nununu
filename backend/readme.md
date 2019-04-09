# Nununu backend

## Run, build & test

### With Docker

#### build image
  ```
  docker-compose build
  ```

#### run image (-d for silent, do without to see debug logs in terminal)
  ```
  docker-compose up -d
  ```

### Without Docker
```
pip install -r requirements.txt
```

```
source bin/activate
```

## Starting the server
  ```
  python server.py
  ```

## Testing
### Running tests
  Remember to list any new files that should be tested in .coveragerc

  ```
  coverage run server_test.py
  ```

### Coverage report
#### Create coverage report
  ```
  coverage html
  ```

#### View coverage report
Open the file htmlcov/index.html in a web browser
