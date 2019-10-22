# @openledcontrol/raspberrypi

Adapter to add support for GitLab CI/CD systems

## Description

Allows to display pipeline states on the LED and alternates between projects if multiple are specified.

## Configuration

In your `openledcontrol.toml` file you can set the following options

```
[GitLab]
# Request an API token and put it here
Token = "<my-gitlab-token>"

# If your host differs from the hosted gitlab instance you need
# to specify the host.
Host = "https://gitlab.com"

# The interval with which the projects pipelines should be updated
UpdateInterval = 15000

# Project ids you want to fetch the status for
Projects = [
  1,
  2,
  3
]

# If you specify this it will only take pipeline states from this ref
Only = "master"
```
