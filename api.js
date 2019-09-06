const baseRoute = 'https://alakajam.com/api';

var Api = {
    featuredEvent: `${baseRoute}/featuredEvent`,
    events: `${baseRoute}/event`,
    theme: `${baseRoute}/theme/:name`
};

module.exports = Api;