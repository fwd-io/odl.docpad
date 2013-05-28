twitter = {
    user: 'odl',
    numTweets: 3,
    appendTo: '#twitter',

    loadTweets: function() {
        $.ajax({
            url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                screen_name: twitter.user,
                include_rts: true,
                count: twitter.numTweets,
                include_entities: true
            },

            success: function(data, textStatus, xhr) {
        for (var i = 0; i < data.length; i++) {
            var tweet = '<div class="tweet"><p>TWEET_TEXT</p>';
            var actions = '<ul class="horizontal"><li><a href="http://www.twitter.com/odl_hh/status/ID">AGO</a></li>'
                          + '<li><a href="https://www.twitter.com/intent/tweet?in_reply_to=ID">reply</a></li>'
                          + '<li><a href="https://www.twitter.com/intent/retweet?tweet_id=ID">retweet</a></li>'
                          + '<li><a href="https://www.twitter.com/intent/favorite?tweet_id=ID">favorite</a></li></ul></div>';

                    tweet = tweet.replace('TWEET_TEXT', twitter.ify.clean(data[i].text));
          actions = actions.replace(/ID/g, data[i].id_str)
                .replace('AGO', twitter.timeAgo(data[i].created_at));
          $(twitter.appendTo).append(tweet+actions);
                }
            }
        });
    },

    /**
  * relative time calculator FROM TWITTER
  * @param {string} twitter date string returned from Twitter API
  * @return {string} relative time like "2 minutes ago"
  */
  timeAgo: function(dateString) {
      var rightNow = new Date();
      var then = new Date(dateString);
       
      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
          // IE can't parse these crazy Ruby dates
          then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
      }

      var diff = rightNow - then;

      var second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24,
      week = day * 7;

      if (isNaN(diff) || diff < 0) {
          return ""; // return blank string if unknown
      }

      if (diff < second * 2) {
          // within 2 seconds
          return "right now";
      }

      if (diff < minute) {
          return Math.floor(diff / second) + " seconds ago";
      }

      if (diff < minute * 2) {
          return "about 1 minute ago";
      }

      if (diff < hour) {
          return Math.floor(diff / minute) + " minutes ago";
      }

      if (diff < hour * 2) {
          return "about 1 hour ago";
      }

      if (diff < day) {
          return  Math.floor(diff / hour) + " hours ago";
      }

      if (diff > day && diff < day * 2) {
          return "yesterday";
      }

      if (diff < day * 365) {
          return Math.floor(diff / day) + " days ago";
      }

      else {
          return "over a year ago";
      }
  }, 
   
  /**
    * The Twitalinkahashifyer!
    * http://www.dustindiaz.com/basement/ify.html
    * Eg:
    * ify.clean('your tweet text');
    */
  ify:  {
    link: function(tweet) {
      return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
        var http = m2.match(/w/) ? 'http://' : '';
        return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
      });
    },

    at: function(tweet) {
      return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
        return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
      });
    },

    list: function(tweet) {
      return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
        return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
      });
    },

    hash: function(tweet) {
      return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
        return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
      });
    },

    clean: function(tweet) {
      return this.hash(this.at(this.list(this.link(tweet))));
    }
  }
};

$(document).ready(function() {
    twitter.loadTweets();
});

// svg fallback
if(!Modernizr.svg)
{
    $("img").each(function() {
        var oldSrc = $(this).attr("src");
        var newSrc = "/assets/img/bitmaps" + oldSrc.slice(oldSrc.lastIndexOf("/"), oldSrc.lastIndexOf(".")) + ".png";
        $(this).attr("src", newSrc);
    });
}