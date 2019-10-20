(function () {
  'use strict';

  angular.module('gmm').service('exportCsvService', exportCsvService);

  /* @ngInject */
  /*jshint -W071*/
  function exportCsvService(moment, languageService) {

    var format = 'MM_DD_YYYY_hh_mm_ss';

    var service = {
      exportBanner: getExportBanner(),
      exportCampaign: getExportCampaign(),
      exportGame: getExportGame(),
      exportParticipant: getExportParticipant(),
      exportPlayer: getExportPlayer(),
      exportPush: getExportPush(),
      exportRegion: getExportRegion(),
      exportGroup: getExportGroup(),
      exportUser: getExportUser()
    };

    return service;

    function getExportBanner() {
      return {
        bannerExport: exportCsvBanner,
        bannerHeader: bannerHeader,
        bannerFileName: bannerFileName,
      };
    }

    function getExportCampaign() {
      return {
        campaignExport: exportCsvCampaign,
        campaignHeader: campaignHeader,
        campaignFileName: campaignFileName,
      };
    }

    function getExportGame() {
      return {
        gameExport: exportCsvGame,
        gameHeader: gameHeader,
        gameFileName: gameFileName,
      };
    }

    function getExportParticipant() {
      return {
        participantExport: exportCsvParticipant,
        participantHeader: participantHeader,
        participantFileName: participantFileName,
      };
    }

    function getExportPlayer() {
      return {
        playerExport: exportCsvPlayer,
        playerHeader: playerHeader,
        playerFileName: playerFileName,
      };
    }

    function getExportPush() {
      return {
        pushExport: exportCsvPush,
        pushHeader: pushHeader,
        pushFileName: pushFileName,
      };
    }

    function getExportRegion() {
      return {
        regionExport: exportCsvRegion,
        regionHeader: regionHeader,
        regionFileName: regionFileName,
      };
    }

    function getExportGroup() {
      return {
        groupExport: exportCsvGroup,
        groupHeader: groupHeader,
        groupFileName: groupFileName,
      };
    }

    function getExportUser() {
      return {
        userExport: exportCsvUser,
        userHeader: userHeader,
        userFileName: userFileName,
      };
    }

    function exportCsvBanner(banners) {
      var exportCsv = [];

      addBanners();
      return exportCsv;

      function addBanners() {
        for (var banner in banners) {
          if (banners[banner] !== null) {
            addGames(banner);
          }
        }
      }

      function addGames(banner) {
        for (var game in banners[banner].games) {
          if (banners[banner].games[game] !== null) {
            addImagens(banner, game);
          }
        }
      }

      function addImagens(banner, game) {
        for (var image in banners[banner].banners) {
          if (banners[banner].banners[image] !== null) {
            addRegions(banner, game, image);
          }
        }
      }

      function addRegions(banner, game, image) {
        for (var region in banners[banner].regions) {
          if (banners[banner].regions[region] !== null) {
            addCampaign(banner, game, image, region);
          }
        }
      }

      function addCampaign(banner, game, image, region) {
        if (banners[banner].campaigns.length > 0) {
          for (var campaign in banners[banner].campaigns) {
            if (banners[banner].campaigns[campaign] !== null) {
              exportCsv.push(addNewLine(banner, game, image, region, campaign));
            }
          }
        } else {
          exportCsv.push(addNewLine(banner, game, image, region));
        }
      }

      function addNewLine(banner, game, image, region, campaign) {
        /*jshint -W106*/
        var newBanner = {};
        newBanner.id = banners[banner].id;
        newBanner.name = banners[banner].name;
        newBanner.games = banners[banner].games[game].name;
        newBanner.regions = banners[banner].regions[region].name;
        newBanner.imageUrl = banners[banner].banners[image].image_url;
        newBanner.targetUrl = banners[banner].banners[image].target_url;
        newBanner.language = languageService.getLanguageName(banners[banner].banners[image].language);
        newBanner.active = banners[banner].active;
        if (campaign !== undefined) {
          newBanner.campaign = banners[banner].campaigns[campaign].name;
        }
        return newBanner;
      }
    }

    function getBannersUrl(banners) {
      var imagens = '';
      /*jshint -W106*/
      for (var i in banners) {
        if (banners[i] !== null) {
          imagens += 'Image URL: ' + banners[i].image_url + ', Target URL: ' + banners[i].image_url + ', \n';
        }
      }
      return imagens.substring(0, (imagens.length - 3));
    }

    function getCampaignStatus(campaign) {

      var ACTIVE = 'ACTIVE';
      var INACTIVE = 'INACTIVE';
      var FINISHED = 'FINISHED';

      /*jshint -W106*/
      if (isFuture(campaign.begin_date)) {
        return campaign.active ? ACTIVE : INACTIVE;
      }
      if (campaign.total_registered_participants >= campaign.participant_limit) {
        return FINISHED;
      }
      if (isPast(campaign.end_date)) {
        return FINISHED;
      }

      return campaign.active ? ACTIVE : INACTIVE;
    }

    function exportCsvGame(games) {
      var exportCsv = [];

      for (var i in games) {
        if (games[i] !== null) {
          var newGame = {};
          /*jshint -W106*/
          newGame.id = games[i].id;
          newGame.name = games[i].name;
          newGame.package = games[i].package_name;
          newGame.game_service_id = games[i].game_service_id;
          newGame.api_key = games[i].api_key;
          newGame.game_image = games[i].game_image;
          exportCsv.push(newGame);
        }
      }
      return exportCsv;
    }

    function exportCsvParticipant(participants) {
      var exportCsv = [];

      for (var i in participants) {
        if (participants[i] !== null) {
          var newParticipant = {};
          /*jshint -W106*/
          newParticipant.email = participants[i].email;
          newParticipant.country = participants[i].location.location_country;
          newParticipant.game = participants[i].game.name;
          newParticipant.campaign = participants[i].campaign.name;
          newParticipant.gcm_id = participants[i].gcm_id;
          newParticipant.gpg_id = participants[i].gpg_id;
          newParticipant.date = moment(new Date(participants[i].date)).utc();
          exportCsv.push(newParticipant);
        }
      }
      return exportCsv;
    }

    function exportCsvPlayer(players) {
      var exportCsv = [];

      for (var i in players) {
        if (players[i] !== null) {
          var newPlayer = {};
          /*jshint -W106*/
          newPlayer.email = players[i].email;
          newPlayer.country = players[i].environment_info.location_country;
          newPlayer.game = players[i].game.name;
          newPlayer.gcm_id = players[i].gcm_id;
          newPlayer.gpg_id = players[i].gpg_id;
          newPlayer.date = moment(new Date(players[i].date)).utc();
          exportCsv.push(newPlayer);
        }
      }
      return exportCsv;
    }

    function exportCsvPush(push) {
      var exportCsv = [];

      for (var i in push) {
        if (push[i] !== null) {
          var newPush = {};
          /*jshint -W106*/
          newPush.id = push[i].id;
          newPush.date = push[i].date;
          newPush.data = moment(new Date(push[i].data)).utc();
          newPush.query = push[i].query;
          newPush.api_key = push[i].api_key;
          newPush.success_count = push[i].success_count;
          exportCsv.push(newPush);
        }
      }
      return exportCsv;
    }

    function exportCsvRegion(regions) {
      var exportCsv = [];

      for (var i in regions) {
        if (regions[i] !== null) {
          var newRegion = {};
          /*jshint -W106*/
          newRegion.id = regions[i].id;
          newRegion.name = regions[i].name;
          newRegion.countries = getCountries(regions[i]);
          exportCsv.push(newRegion);
        }
      }
      return exportCsv;
    }

    function exportCsvGroup(groups) {
      var exportCsv = [];

      for (var i in groups) {
        if (groups[i] !== null) {
          var newGroup = {};
          /*jshint -W106*/
          newGroup.id = groups[i].id;
          newGroup.name = groups[i].name;
          exportCsv.push(newGroup);
        }
      }
      return exportCsv;
    }

    function exportCsvUser(users) {
      var exportCsv = [];

      for (var i in users) {
        if (users[i] !== null) {
          var newUser = {};
          /*jshint -W106*/
          newUser.id = users[i].id;
          newUser.username = users[i].username;
          exportCsv.push(newUser);
        }
      }
      return exportCsv;
    }

    function bannerFileName() {
      return 'gamma_bannes_' + moment().format(format) + '.csv';
    }

    function bannerHeader() {
      return ['ID', 'NAME', 'GAMES', 'REGIONS', 'IMAGE URL', 'TARGET URL', 'LANGUAGE', 'ACTIVE', 'CAMPAIGN'];
    }

    function campaignFileName() {
      return 'gamma_campaigns_' + moment().format(format) + '.csv';
    }

    function campaignHeader() {
      return ['ID', 'NAME', 'BEGIN DATE', 'END DATE', 'TIMEZONE', 'PARTICIPANT LIMIT', 'TOTAL REGISTERED', 'COUNTRIES',
        'GAMES', 'ACTIVE', 'STATUS'];
    }

    function gameFileName() {
      return 'gamma_games_' + moment().format(format) + '.csv';
    }

    function gameHeader() {
      return ['ID', 'NAME', 'PACKAGE', 'SERVICE ID', 'API KEY', 'IMAGE'];
    }

    function participantFileName() {
      return 'gamma_participants_' + moment().format(format) + '.csv';
    }

    function participantHeader() {
      return ['EMAIL', 'COUNTRY', 'GAME', 'CAMPAIGN', 'GCM ID', 'GPG ID', 'DATE'];
    }

    function playerFileName() {
      return 'gamma_players_' + moment().format(format) + '.csv';
    }

    function playerHeader() {
      return ['EMAIL', 'COUNTRY', 'GAME', 'GCM ID', 'GPG ID', 'DATE'];
    }

    function pushFileName() {
      return 'gamma_push_' + moment().format(format) + '.csv';
    }

    function pushHeader() {
      return ['ID', 'DATE', 'DATA', 'QUERY', 'SEND SUCCESS'];
    }

    function regionFileName() {
      return 'gamma_regions_' + moment().format(format) + '.csv';
    }

    function regionHeader() {
      return ['ID', 'NAME', 'COUNTRIES'];
    }

    function groupHeader() {
      return ['ID', 'NAME'];
    }

    function groupFileName() {
      return 'gamma_groups_' + moment().format(format) + '.csv';
    }

    function userHeader() {
      return ['ID', 'USERNAME'];
    }

    function userFileName() {
      return 'gamma_users_' + moment().format(format) + '.csv';
    }

    function isFuture(date) {
      return timeDiffInSecondsTo(date) > 0;
    }

    function isPast(date) {
      return timeDiffInSecondsFrom(date) > 0;
    }

    function timeDiffInSecondsFrom(date) {
      return (new Date() - new Date(date)) / 1000;
    }

    function timeDiffInSecondsTo(date) {
      return (new Date(date) - new Date()) / 1000;
    }

    function exportCsvCampaign(campaigns) {
      var exportCsv = [];

     addCampaigns();

      return exportCsv;

      function addCampaigns() {

        for (var campaign in campaigns) {
          if (campaigns[campaign] !== null) {
            addGames(campaign);
          }
        }
      }

      function addGames(campaign) {
        for (var form in campaigns[campaign].forms) {
          if (campaigns[campaign].forms[form] !== null) {
            addRegions(campaign, form);
          }
        }
      }

      function addRegions(campaign, form) {
        for (var region in campaigns[campaign].regions) {
          if (campaigns[campaign].regions[region] !== null) {
            addNewLine(campaign, form, region);
          }
        }
      }

      function addNewLine(campaign, form, region) {
        /*jshint -W106*/
        var newCampaign = {};
        newCampaign.id = campaigns[campaign].id;
        newCampaign.name = campaigns[campaign].name;
        newCampaign.beginDate = moment(new Date(campaigns[campaign].begin_date)).utc();
        newCampaign.endDate = moment(new Date(campaigns[campaign].end_date)).utc();
        newCampaign.gmtTimezone = campaigns[campaign].gmt_timezone;
        newCampaign.participantLimit = campaigns[campaign].participant_limit;
        newCampaign.totalRegisteredParticipants = campaigns[campaign].total_registered_participants;
        newCampaign.regions = campaigns[campaign].regions[region].name;
        newCampaign.games = campaigns[campaign].forms[form].game.name;
        newCampaign.active = campaigns[campaign].active;
        newCampaign.status = getCampaignStatus(campaigns[campaign]);
        exportCsv.push(newCampaign);
      }
    }

    function getCountries(region) {
      var countryName = '';
      /*jshint -W106*/
      for (var i in region.countries) {
        if (region.countries[i] !== null) {
          countryName += region.countries[i].country_name + ', ';
        }
      }
      return countryName.substring(0, (countryName.length - 2));
    }

  }

})();
