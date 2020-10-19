# circleci-orb-user-test

A sandbox to try out various CircleCI concepts:

- Authing to Docker Hub for executor setup
- Authing to Docker Hub for non-executor Docker image pulls (ex. backing services)
- Authing to Docker Hub for pulling base image for building an app
- Using the Pub/Sub emulator from a backing service non-executor Docker container

In this example, the test code and app source code are the same. The app doesn't do anything. The important thing is the app build process in CircleCI.
