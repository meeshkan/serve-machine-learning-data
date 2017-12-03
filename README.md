# serve-machine-learning-data
A simple heroku app to serve your machine learning data to Meeshkan.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/meeshkan/serve-machine-learning-data)

## How to use this
Assuming that you call your app `resonant-dunes`, you can populate the dataset by sending `POST` requests to `http://resonant-dunes.herokuapp.com/i/MEESHKAN_KEY` with your data.  Split your data into whatever chunks you would like.  `MEESHKAN_KEY` is, as you might guess, your Meeshkan key.  See our note below about how to retrieve your key. The data should be formated as a group of rows, each of which is a pair of X (feature) and Y (target) values. For example, assuming that you are learning housing prices based on square meters and proximity to a beach in kilometers, and your data looked like this:


| m2        | beach km      | price       |
| --------- |:-------------:| -----------:|
| 70        | 4             | 270 000 €   |
| 80        | 3             | 510 000 €   |
| 90        | 2             | 980 000 €   |
| 100       | 1             | 1 350 000 € |

You would post this:

```
[[[70, 4], [270000]], [[80, 3], [510000]]]
```

and later, when you have more data or if you are splitting the data up into reasonably-sized chunks...

```
[[[90, 2], [980000]], [[100, 1], [1350000]]]
```

To get the data back, just ping `https://resonant-dunes.herokuapp.com/o?n=3&o=0` where `n` is the number of rows you want and `o` is the offset in the dataset.

Meeshkan makes no assumption about the dimensions of your features and targets.  Make sure that you serve data with the correct dimensions for your model.

## After deployment
When you deploy your Heroku app, you'll see that it will autogenerate a `MEESHKAN_KEY` config variable on startup.  To get the content of this variable so that you can make a POST request, click on `Manage App` after deploymnet succeeds and then on `Settings > Config Variables > Reveal Config Vars`.  You'll see the value of `MEESHKAN_KEY`.  If you ever change this value, make sure to reboot your app for the change to take effect!

For larger Machine Learning jobs, you will want to pay for a bigger storage plan.  Heroku's free tier for Postgre SQL allows for 10,000 rows.

If you want to deploy this to AWS Elastic Beanstalk, you can follow [this guide](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html). To see a working example that uses the MNIST dataset, try `curl "https://mnist.meeshkan.io/o?n=22&o=101"`.

## Full API


| Path                     | Method               | Description                                                      |
| :----------------------- |:---------------------| :----------------------------------------------------------------|
| `/o?n=5&o=3`             | `GET`                | Gets `5` rows with an offset of `3` in the dataset               |
| `/o?n=4&o=8&tag=true`    | `GET`                | Gets `4` rows with an offset of `8` in the dataset, returns tags |
| `/o/FOO?n=100&o=0`       | `GET`                | Gets `100` rows with an offset of `0` for rows tagget `FOO`      |
| `/i/MEESHKAN_KEY`        | `POST`               | Posts data                                                       |
| `/i/MEESHKAN_KEY/FOO`    | `POST`               | Posts data and taggs it `FOO`                                    |
| `/i/MEESHKAN_KEY`        | `DELETE`             | Deletes all data                                                 |
| `/i/MEESHKAN_KEY/FOO`    | `DELETE`             | Deletes all data with tag `FOO`                                  |
| `/i/MEESHKAN_KEY/FOO/5`  | `DELETE`             | Deletes all data with tag `FOO` and id `5`                       |

