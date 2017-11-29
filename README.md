# serve-machine-learning-data
A simple heroku app to serve your machine learning data to Meeshkan.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/meeshkan/serve-machine-learning-data)

## After deployment
The default deployment above creates a Heroku app called `serve-machine-learning-data` with a default Meeshkan key called `you-should-never-use-this-for-any-serious-deployment`. As the name suggests, you should never use this for any serious deployment.  Instead, you should generate your keys from [https://app.meeshkan.com](https://app.meeshkan.com) when you schedule your ML job.

Too see an example, check out [https://meeshkan-mnist.herokuapp.com](https://meeshkan-mnist.herokuapp.com).  Note that to use the Meeshkan service, you *must* serve your data using HTTPS.  This means you have to pony up seven bucks a month for Heroku's SSL.  This is a small price to pay for data security and a good habit to get into!  Plus, by paying for a basic Heroku subscription, your apps won't hybernate, so Meeshkan will run much faster.

You can also check out the same repo for AWS Elastic Beanstalk if you are an AWS girl or guy.
