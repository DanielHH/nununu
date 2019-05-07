# Nununu backend

## Running locally
You  have two options:
1. use a virtual environment if you just want to run the python code
2. run using docker to run with nginx, postgresql db and python server app.

### 1. Virtual environment
setup a virtual environment using Python3

```
python3 -m venv .
```

activate the virtual environment
```
source bin/activate
```

install  packages
```
pip install -r requirements.txt
```

#### Starting the server
  ```
  python server.py
  ```

#### Running tests
  Remember to list any new files that should be tested in .coveragerc
  ```
  coverage run server_test.py
  ```

#### Create coverage report
  ```
  coverage html
  ```

#### View coverage report
Open the file htmlcov/index.html in a web browser


### 2. Docker

Requires docker and docker-compose to be installed on your system.

#### build image
  ```
  docker-compose build
  ```

#### run image (silently with -d)
  ```
  CADDYFILE=./caddy/Caddyfile.local docker-compose up -d
  ```


# Deploying on Google Compute Engine
When creating a new compute engine instance make sure to change the boot disk to "Container-Optimized OS stable".

To start with ssh into the created instance and follow the steps below.

generate a ssh-key with
  ```
  ssh-keygen
  ```
copy that key and add it to the deployment keys in this gitlab repo.
Clone the repo
  ```
  git clone https://gitlab.liu.se/rical803/tddd27_2019_nununu
  ```
cd in to 'backend/' directory in the cloned repo.

Download and install docker-compose
  ```
  docker run docker/compose:1.24.0 version
  ```

  Make an alias for docker-compose
  ```
  echo alias docker-compose="'"'docker run \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:$PWD" \
    -w="$PWD" \
    docker/compose:1.24.0'"'" >> ~/.bashrc
  ```
Reload the Bash configuration.
  ```
  source ~/.bashrc
  ```

now you can use 'docker-compose' command as usual.

build image
  ```
  docker-compose build
  ```

run image (silently with -d)
  ```
  docker-compose up -d
  ```
