node {
    def app
    environment {
        registry = "sandy1480/docker-test"
    }
    stage('*** Clone Repository ***') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }

    stage('*** Build Image ***') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */

        app = docker.build("my-app:${env.BUILD_ID}")
    }
}
