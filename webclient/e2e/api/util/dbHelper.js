'use strict';

var dbUtilHelper = {};
dbUtilHelper.run = run;
dbUtilHelper.cleanData = cleanData;

function run(sql) {

  var sys = require('sys'),
    url_bd = 'localhost',
  //  url_bd = 'http://test-asus.embedded.ufcg.edu.br',
    process = require('child_process'),
    //dbName = 'gmm',
  dbName = 'e2e_gmm',
    child;

  child = process.execSync('mysql -u root -proot -h ' + url_bd + ' ' + dbName + ' -e \"' + sql + '\"');

  console.log(child.toString());
}

function cleanData() {

    //banner
    dbUtilHelper.run("delete from gmm_banner_bannerconfiguration_regions where id=10"),
    dbUtilHelper.run("delete from gmm_banner_bannerconfiguration_games where id=10"),
    dbUtilHelper.run("delete from gmm_banner_banner where id = 1 or id=100 or id=101 or id=102"),
    dbUtilHelper.run("delete from gmm_banner_bannerconfiguration where id = 100"),
    //participation in campaign
    dbUtilHelper.run("delete from gmm_campaign_participation where player_id=1000 or player_id=1001"),
    dbUtilHelper.run("delete from gmm_campaign_location where id=1000"),
    //campaign
    dbUtilHelper.run("delete from gmm_campaign_rule where game_id=1000 or game_id = 1001"),
    dbUtilHelper.run("delete from gmm_campaign_campaign_regions where id=1000 or id = 1001"),
    dbUtilHelper.run("delete from gmm_campaign_campaign where id=1000 or id=1001"),
    //user game
    dbUtilHelper.run("delete from gmm_push_deviceuser where game_id=1000 or game_id=1001"),
    dbUtilHelper.run("delete from gmm_push_environmentinfo"),
    //game
    dbUtilHelper.run("delete from gmm_game_pushtemplate where id=1000 or id=1001"),
    dbUtilHelper.run("delete from gmm_game_game where id=1000 or id=1001")
}

module.exports = dbUtilHelper;
