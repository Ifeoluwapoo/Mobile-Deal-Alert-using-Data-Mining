var Nightmare = require('nightmare');
var cheerio = require('cheerio');
var url = require('url');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var iplocate = require('node-iplocate');
var publicIp = require('public-ip');
var dbUrl = "mongodb://localhost:8020/";
  

   

class CrawlerController {

    constructor() {
        // ...
    }

    crawlWeb(value, callback) {

        var nightmare = Nightmare({
            show: false
        });
        var srcUrl = "https://www.bing.com/images/search?q=discounted price for " + value + "&FORM=HDRSC2";
        nightmare
            .goto(srcUrl)
            .wait('body')
            .wait('div[id="vm_c"]').evaluate(() => document.querySelector('body').innerHTML)
            .end().then(response => {
                callback(dataScrapper(response));
            }).catch(err => {
                console.log(err);
            });
        let dataScrapper = html => {
            let data = [];
            const $ = cheerio.load(html, {
                ignoreWhitespace: true,
                xmlMode: true
            });
            $('div.dg_b').find('div > ul > li').each((li_row, li_element) => {
                let details = $(li_element).find('a.iusc').attr('m');
                let image = $(li_element).find('img').attr('src');

                if (image) {
                    var base64Image = image.indexOf('base64,');
                    data.push({
                        details: (details)? JSON.parse(details) : {},
                        image: (base64Image > 1) ? image : "http://www.bing.com" + image,
                    });
                }
            }); return data;
        };

    }

    crawlPage(value, callback) {

        var nightmare = Nightmare({
            show: false
        });

        var srcUrl = "https://www.bing.com/images/search?q=discounted price for " + value + "&FORM=HDRSC2";
        nightmare
            .goto(srcUrl)
            .wait('body')
            .wait('div[id="vm_c"]').evaluate(() => document.querySelector('body').innerHTML)
            .end().then(response => {
                callback(dataScrapper(response));
            }).catch(err => {
                console.log(err);
            });

            
        let dataScrapper = html => {
            let data = [];
            const $ = cheerio.load(html, {
                ignoreWhitespace: true,
                xmlMode: true
            });
            $('div.dg_b').find('div > ul > li').each((li_row, li_element) => {
                let details = $(li_element).find('a.iusc').attr('m');
                let image = $(li_element).find('img').attr('src');

                if (image) {
                    var base64Image = image.indexOf('base64,');
                    data.push({
                        details: JSON.parse(details),
                        image: (base64Image > 1) ? image : "http://www.bing.com" + image,
                    });
                }
            });

            return data;
        }

    }

    getImage(srcUrl, callback) {

        srcUrl = "http://bing.com" + srcUrl;

        var nightmare = Nightmare({
            show: false
        });
        nightmare
            .goto(srcUrl)
            .wait('body')
            .wait('div[id="mainImageWindow"]').mouseover('a').evaluate(() => document.querySelector('body').innerHTML)
            .end().then(response => {
                callback(scrapeImage(response));
            }).catch(err => {
                console.log(err);
            });

        let scrapeImage = html => {
            const $ = cheerio.load(html);
            return $('.imgContainer').find('img').attr("src");
        };
    }

    
    
}
module.exports = CrawlerController;

