var sizes = [
  'Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB'
];
clean = ['{', '}', '+', '_', '*', '-', '.', '/', '(', ')', '[', ']', '\'', ',', '&', '~', '!', '@', ':', ';', '%', '?', '¿', '!', '¡', '$', '%', '^', '\\', '|', '<', '>', '`']

var subcategories = {
  'hd___movies': 'HD Movies',
  'movies': 'Movies',
  'tv_shows': 'TV Shows',
  'hd___tv_shows': 'TV Shows (HD)',
  'movie_clips': 'Movie Clips',
  'other': 'Other',
  '3d': '3D',
  'movies_dvdr': 'Movies DVDR',
  'music_videos': 'Music Videos',
  'handheld': 'Handeld',
  'pc': 'PC',
  'psx': 'Playstation',
  'other': 'Other',
  'xbox360': 'XBOX',
  'wii': 'Nintendo Wii',
  'android': 'Android',
  'mac': 'Mac',
  'ios_(ipad_iphone)': 'iOS',
  'applications': 'Applications',
  'windows': 'Windows',
  'other_os': 'Other OS',
  'unix': 'UNIX',
  'audio': 'Audio',
  'music': 'Music',
  'flac': 'High Quality Audio (flac)',
  'audio_books': 'Audiobooks',
  'sound_clips': 'Sound Clips',
  'e_books': 'E-books',
  'comics': 'Comics',
  'pictures': 'Pictures',
  'movies': 'Movies',
  'porn': 'Porn',
  'pictures': 'Pictures',
  'games': 'Games'

}

var separate_by = function(words, symbol) {
  var final_words = []
  words.forEach(function(each_word) {
    each_word.split(symbol).forEach(function(each_single_word) {
      final_words.push(each_single_word.toLowerCase())
    })
  })

  var really_final_words = []
  final_words.forEach(function(fw) {
    if (fw && fw.length > 0) {
      really_final_words.push(fw)
    }

  })
  return really_final_words
}

var urls = []

document.findword = function(info, callback) {
  $.getJSON('https://part-' + info.page + '.metadata-cache.com/search/' + info.word + '.json', function(data) {
      if (document.hashtotal == undefined) {
        document.hashtotal = 0
      }
      var i = info.page;

      // console.log(data.length)

      if (document.words.length > 1) {
        // console.log('we got more than one word indeed...')
        data.forEach(function(part) {

          var all_good = true
          document.words.forEach(function(word) {
            if (info.word.indexOf(word) == -1) {
              if (document.allwords.indexOf(word + part) == -1) {
                all_good = false;
              }
            }
          })


          if (all_good && document.hashesadded.indexOf(part) == -1) {
            document.alldata.push({ page: info.page, hash: part })
            document.hashtotal = document.hashtotal + 1
            document.hashesadded.push(part)

          } else {

            document.allwords.push(info.word + part)
          }
        })
      } else {

        data.forEach(function(part) {
          document.alldata.push({ page: info.page, hash: part })
          document.hashtotal = document.hashtotal + 1

        })
      }

      showing_data = document.alldata //.slice(page_start, page_end)

      showing_data.forEach(function(info) {
        count_showed = count_showed + 1
          // console.log('count_showed', info)
        if (count_showed >= page_start && count_showed < page_end) {
          get_metadata(info.page, info.hash, '#results')
        }
      })
      document.alldata = []

      data_showed = true

    }).done(function() {
      // console.log("second success");
    })
    .fail(function(err) {
      // console.log("error!", err);
    })
    .always(function() {
      callback(document.alldata)
        // console.log("complete", 'https://part-' + info.page + '.metadata-cache.com/search/' + info.word + '.json');
    });

}


var url_attributes = window.location.search.replace('?', '').split('&')
var domain_name = window.location.hostname.replace('localhost', 'KAYANBU').replace('.com', '').replace('www.', '').replace('.github.io', '').toUpperCase()
$('#pagename').text(domain_name)
document.title = domain_name;
document.request = {}
url_attributes.forEach(function(attribute) {
    var got = attribute.split('=')
    document.request[got[0]] = got[1]
  })
  // console.log(document.request)

var prettysize = function(size, nospace, one) {
  var mysize, f;

  sizes.forEach(function(f, id) {
    if (one) {
      f = f.slice(0, 1);
    }
    var s = Math.pow(1024, id),
      fixed;
    if (size >= s) {
      fixed = String((size / s).toFixed(1));
      if (fixed.indexOf('.0') === fixed.length - 2) {
        fixed = fixed.slice(0, -2);
      }
      mysize = fixed + (nospace ? '' : ' ') + f;
    }
  });

  if (!mysize) {
    f = (one ? sizes[0].slice(0, 1) : sizes[0]);
    mysize = '0' + (nospace ? '' : ' ') + f;
  }

  return mysize;
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

var template = $('#result-template').html()

var render = function(metadata) {
  var template = $('#result-template').html()
  template = template.replace(/NAME/g, metadata.title)
  template = template.replace(/SIZEMB/g, prettysize(metadata.size))
  if (metadata.peers) {
    template = template.replace(/PEERS/g, (metadata.peers))
  } else {
    template = template.replace(/PEERS/g, (metadata.seeders) + (metadata.leechers))
  }
  template = template.replace(/MAGNET/g, (metadata.magnet))
  if (metadata.torrent != undefined) {
    console.log(metadata)
    template = template.replace(/HASH/g, (metadata.parsed.infoHash))
  } else {
    template = template.replace(/HASH/g, (metadata.torrent.infoHash))
  }
  return template
}
var result_count = 0
document.hashtotal = 0
var get_categ_data = function(a, b, category, sub_category, callback) {
  var categurl = 'https://part-' + a + '.metadata-cache.com/categories/' + category + ':' + sub_category + ':' + b + '.json'


  $.getJSON(categurl, function(result) {
      // console.log(result)
      document.hashtotal = document.hashtotal + result.length
      $('#resultsnumber').text(' (showing ' + page_start + '-' + (page_start + 1 + result_count) + ' of ' + (document.hashtotal) + ')')

      var div = '#subcateg' + category + sub_category
        // result = shuffle(result)
      result = result.slice(0, 100)
      result.forEach(function(info) {
          count_showed = count_showed + 1

          // console.log('count_showed', count_showed, page_start, page_end)
          if (count_showed >= page_start && count_showed < page_end) {
            get_metadata(a, info, div)
          }
        })
        // result.forEach(function(each_hash) {
        //     get_metadata(0, each_hash, div)
        //   })
        // result()

    }).done(function() {
      // console.log("second success");
    })
    .fail(function(err) {
      // console.log("error!", err);
    })
    .always(function() {
      callback(document.alldata)
    });

}

var add_categ_to_div = function(category, sub_category) {

  var categs_requests = []
  for (var b = 0; b < 10; b++) {
    for (var a = 0; a < 10; a++) {

      categs_requests.push({ 'a': a, 'b': b, 'category': category, 'sub_category': sub_category })
        // get_categ_data(a, b, category, sub_category)
    }
  }
  // console.log(categs_requests)

  async.eachSeries(categs_requests, function iteratee(categ_request, callback) {
    get_categ_data(categ_request['a'], categ_request['b'], categ_request['category'], categ_request['sub_category'], function(data) {
      callback(null, data);
    })

  }, function done(alldata) {
    // console.log(alldata)
    console.log('DONE!', document.alldata.length)
    $('#spinner').hide()

  }, function error() {
    console.log('Error!')
  });

}

if (document.request['page'] != undefined) {
  var page = parseInt(document.request['page'])
} else {
  var page = 1
}

var count_showed = 0
var comment = ""

if (document.request['query'] != undefined) {
  document.words = document.request['query'].split('+')

  clean.forEach(function(remove_symbol) {
    document.words = separate_by(document.words, remove_symbol)
  })

  if (document.words.length > 3) {
    comment = " (Max 3 words allowed)"
    document.words = document.words.slice(0, 3)
  }

  $('#resultsfor').text('Results for "' + document.words.join(' ') + '"' + comment)
  $('#maininput').val(document.words.join(' '))

  document.words = document.words.filter(function(word) {
    return word.length > 1
  })

  // pages page
  for (var i = 0; i < 37; i++) {
    document.words.forEach(function(word) {
      urls.push({ page: i, word: word })
    })
  }

  // console.log(JSON.stringify(urls))


  setTimeout(function() {
    // console.log(document.hashtotal)
    if (document.hashtotal == undefined) {
      $('#spinner').hide()
    }
  }, 10000)

  // console.log('urls', urls)
  async.eachSeries(urls, function iteratee(url, callback) {
    document.findword(url, function(data) {
      callback(null, data);
    })

  }, function done(alldata) {
    // console.log(alldata)
    console.log('DONE!', document.alldata.length)
    $('#spinner').hide()

  }, function error() {
    console.log('Error!')
  });

  // console.log('searching coincidences for:', document.words)


} else {
  setTimeout(function() {
    $('#spinner').hide()
      // console.log('HIDE SPINNER!')
  }, 5000)

  if (document.request['categ'] != undefined) {

    // console.log('show the categ')

    var each_category = document.request['categ']
    var each_sub_category = document.request['subcateg']

    // console.log('Showing html!')
    $('#results').append('<div class="categ" id="categ' + document.request['categ'] + '">' + '</div>')
    $('#categ' + each_category).append('<div class="subcateg" id="subcateg' + document.request['categ'] + each_sub_category + '" id="categ' + each_sub_category + '"><a class="categlink" href="?categ=' + each_category + '&subcateg=' + each_sub_category + '">' + each_category.toUpperCase() + ' - ' + subcategories[each_sub_category] + '</a></div>')
    add_categ_to_div(each_category, each_sub_category)
    $("#result-table").show()

  } else {

    // console.log('show some torrents')

    $.getJSON('https://part-0.metadata-cache.com/categories.json', function(categories) {
      // console.log(categories)
      Object.keys(categories).forEach(function(each_category) {
        if (each_category.indexOf('porn') != 0) {
          $('#results').append('<div class="categ" style="display:none;" id="categ' + each_category + '">' + '</div>')
          Object.keys(categories[each_category]).forEach(function(each_sub_category) {
            if (categories[each_category][each_sub_category] > 100) {
              $('#categ' + each_category).append('<div class="subcateg" id="subcateg' + each_category + each_sub_category + '" id="categ' + each_sub_category + '"><a class="categlink" href="?categ=' + each_category + '&subcateg=' + each_sub_category + '">' + each_category.toUpperCase() + ' - ' + subcategories[each_sub_category] + '</a></div>')
              add_results_to_div(each_category, each_sub_category)
            }

          });
        }

      })
    })
  }


}



function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



var add_results_to_div = function(each_category, each_sub_category) {
  $.getJSON('https://part-0.metadata-cache.com/categories/' + each_category + ':' + each_sub_category + ':0.json', function(result) {
    // console.log(result)
    var div = '#subcateg' + each_category + each_sub_category
    result = shuffle(result)
    result = result.slice(0, 10)
    result.forEach(function(each_hash) {
        get_metadata(0, each_hash, div, each_category)
      })
      // result()
  })
}


var page_start = 100 * (page - 1)
var page_end = 100 * page
var showing_count = 0

document.seeders_count = []
var get_metadata = function(i, hash, addto, each_category) {
  // console.log('<get_metadata>', i, hash, addto)
  $.getJSON('https://part-' + i + '.metadata-cache.com/metadata/' + hash + '.json', function(metadata) {
    $("#result-table").show()


    showing_count = showing_count + 1

    $(addto).append(render(metadata));



    if (metadata.torrent != undefined) {
      $('#description' + metadata.torrent.infoHash).html(unescape(metadata.description.replace(/\n/g, '</br>')))
    } else {
      $('#description' + metadata.parsed.infoHash).html(unescape(metadata.description.replace(/\n/g, '</br>')))
    }

    function unescapeHtml(safe) {
      return $('<div />').html(safe).text();
    }

    if (document.words || document.request['categ'] != undefined) {
      $('#resultsnumber').text(' (showing ' + page_start + '-' + (page_start + 1 + result_count) + ' of ' + (document.hashtotal) + ')')
    } else {
      $('#resultsnumber').hide()
    }

    if (document.hashtotal > page_start + 100) {
      $('#buttonnext').show()
    }
    if (page_start > 0) {
      $('#buttonprevious').show()
    }

    result_count = result_count + 1

    // console.log('page_end: ', page_end, 'page_start:', page_start)
    if ((page_end - page_start) == (result_count)) {}
    if (each_category != undefined) {
      var fatherdiv = '#categ' + each_category
      $(fatherdiv).show()
    }

  })
}

document.alldata = []
document.allwords = []
document.hashesadded = []

var data_showed = false



var pageback = function() {
  console.log('one page back')
  console.log('one page next')

  var result = []
  if (page == 1) {
    document.request['page'] = 1
  }
  document.request['page'] = parseInt(document.request['page']) - 1
  if (document.request['page'] < 1) {
    document.request['page'] = 1
  }
  Object.keys(document.request).forEach(function(each_one) {
    result.push(each_one + "=" + document.request[each_one])
    console.log(result)
  })


  window.location.href = '?' + result.join('&');
}
var pagenext = function() {
  console.log('one page next')

  var result = []
  if (page == 1) {
    document.request['page'] = 1
  }
  document.request['page'] = parseInt(document.request['page']) + 1
  Object.keys(document.request).forEach(function(each_one) {
    result.push(each_one + "=" + document.request[each_one])
  })

  window.location.href = '?' + result.join('&');;
}





$('[data-unix]').each(function() {
  var unix = $(this).attr('data-unix');
  var time = moment.unix(unix);
  $(this).html(time.format('YYYY/MM/DD h:mm A'));
});
$('[data-unix-short]').each(function() {
  var unix = $(this).attr('data-unix-short');
  if (unix != 0) {
    var time = moment.unix(unix);
    $(this).html(time.format('YYYY/MM/DD'));
    $(this).attr('alt', time.format('YYYY/MM/DD h:mm A'));
    $(this).attr('title', time.format('YYYY/MM/DD h:mm A'));
  }
});

$(function() {
  $(document).on('click', '.sort', function(event) {
    event.preventDefault();
    var type = $(event.target).attr('data-sort');
    var results = $('#results > *').sort(function(a, b) {
      if (type == 'name') {
        var aSort = a.getAttribute('data-' + type);
        var bSort = b.getAttribute('data-' + type);
        if (aSort > bSort) return 1;
        if (aSort < bSort) return -1;
        return 0;
      } else {
        var aSort = parseInt(a.getAttribute('data-' + type));
        var bSort = parseInt(b.getAttribute('data-' + type));
        if (aSort > bSort) return -1;
        if (aSort < bSort) return 1;
        return 0;
      }
    }).prependTo('#results');
  });
});