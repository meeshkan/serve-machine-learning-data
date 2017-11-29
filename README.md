# serve-machine-learning-data
A simple heroku app to serve your machine learning data to Meeshkan.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/meeshkan/serve-machine-learning-data)

## How to use this
Assuming that you call your app `resonant-dunes`, you can populate the dataset by sending a `POST` request to `http://resonant-dunes.herokuapp.com/MEESHKAN_KEY` containing your data.  `MEESHKAN_KEY` is, as you might guess, your Meeshkan key.  See our note below about how to retrieve your key. The data should be formated as a group of rows, each of which is a pair of X (feature) and Y (target) values. For example, assuming that you are learning housing prices based on square meters and proximity to a beach in kilometers, and your data looked like this:


| m2        | beach km      | price     |
| --------- |:-------------:| ---------:|
| 70        | 3             | 270 000 € |
| 80        | 2             | 510 000 € |
| 90        | 1             | 980 000 € |

You would post this:

```
[[[70, 3], [270000]], [[80, 2], [510000]], [[90, 1], [980000]]]
```

Then, to get the data back, just ping `https://resonant-dunes.herokuapp.com?n=3&o=0` where `n` is the number of rows you want and `o` is the offset in the dataset.

## After deployment
When you deploy your Heroku app, you'll see that it will autogenerate a `MEESHKAN_KEY` config variable on startup.  To get the content of this variable so that you can make a POST request, click on `Manage App` after deploymnet succeeds and then on `Settings > Config Variables > Reveal Config Vars`.  You'll see the value of `MEESHKAN_KEY`.  If you ever change this value, make sure to reboot your app for the change to take effect!

Note that to use the Meeshkan service, you *must* serve your data via HTTPS.  This means that, if you're serving from Heroku, you have to pony up [seven bucks a month](https://www.heroku.com/pricing) for Heroku's SSL.  This is a small price to pay for data security and a good habit to get into!  Plus, by paying for a basic Heroku subscription, your apps won't hybernate, so Meeshkan will run much faster.

For larger Machine Learning jobs, you will want to pay for a bigger storage plan.  Heroku's free tier for Postgre SQL allows for 10,000 rows.

If you want to deploy this to AWS Elastic Beanstalk, you can follow [this guide](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html). To see a working example that uses the MNIST dataset, try `curl "https://mnist.meeshkan.io?n=22&o=101"`.
