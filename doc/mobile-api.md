# Mobile API
------
This document describes part of GaMMa API that serves mobile apps/games.


## Security
------
This API is available over HTTPS protocol with client certificate authentication.

(This session is uncompleted)

## Services
------

### General considerations
------

#### **User's environment data**
 
It's a JSON object used on X-Env request header that follows the following format:

```json
{
    "app_language": "PT",
    "device_language" : "en-us",
    "app_version" : "1.2.1",
    "location_status": "success",
    "location_country": "United States",
    "location_country_code": "US",
    "location_region": "CA",
    "location_region_name": "California",
    "location_city": "San Francisco",
    "location_zip": "94105",
    "location_lat": "37.7898",
    "location_lon": "-122.3942",
    "location_timezone": "America Los_Angeles",
    "location_isp": "Wikimedia Foundation",
    "location_org": "Wikimedia Foundation",
    "location_as": "AS14907 Wikimedia US network",
    "location_query": "208.80.152.201",
    "location_source": "4G - IP API",
    "location_date": "2016-09-04T19:13:40Z"
}
```

#### **Required headers - default response status**

All mobile API services require two specific headers: X-Token, X-Env. <br/>
Errors related to those headers will always perform the same ways in all services, detailed bellow: <br/>

**X-Token**

**401 - Unauthorized**

* Possible body responses: 
     * `{"detail": "Authentication credentials were not provided."}`
     * `{"detail": "Signature has expired."}`
     * `{"detail": "Error decoding signature."}`
     * `{"detail": "Invalid Authorization header. No credentials provided."}`

**X-Env**

**400 - Bad Request**

* **Cause**: header was not provided or JSON object format is wrong
* Possible response body:
     * `{"location_city": ["This field is required."]}`
     * `{"detail": "Location not provided."}`

* **Cause**: Internal business rule (e.g.: 'Unknown app language') was detected
* Possible response body:
     * `{"detail":"Invalid app language."}`


* **Cause**: Internal business rule (e.g.: 'Unknown country code') was detected
* Possible response body: 
     * `{"detail":"Invalid country code."}`


* **Cause**: Internal business rule (e.g.: 'Country code and country name are not associated') was detected
* Possible response body:
     * `{"detail": "The country \"United States\" does not match with the country code \"BR\"."}`



### Game's user
------

This services should be used to register the devices that has an specific Asus game/app installed. These informations can be used to future communication over `email` or `push notification`.

#### Register Device User

**Path**: /gmm/mobile/v1/game/{_serviceId}_/user

**Method**: POST

**Headers**:

 * X-Token: {security API token}
 * X-Env: ([user's environment data](#users-environment-data))

**Data**: JSON (following the format bellow)
```json
{
 "email": "user@gmail.com",
 "gpg_id": "12391843216842387",
 "gcm_id": "951354987654312"
}
```

##### Response Status 
**201 - Create**
 
**200 - User was updated**

 * **Cause**: It happens when a request comes to the system to create a device user using email and gcm already existing, but the GPG is new.
 
**404 - Not Found**

 * **Cause**: The game wasn't found
 * Response body: `{"detail": "Game not found."}`
 
**409 - Conflict**

 * **Cause**: It happens when already exists a device user using the same email, GCM and GPG.
 * Response body: `{"detail": "Player already registered."}`

### Banner
------

This services should be used to get banners that should be shown to user according the app and the region where user is.

#### Get Banners

**Path**: /gmm/mobile/v1/game/_{serviceId}_/banner.opened

**Method**: GET

**Headers**:

 * X-Token: {security API token}
 * X-Env: JSON ([user's environment data](#users-environment-data))

###### Response Status 
**200 - OK** (response body contains a banners list that should be empty if there is no banner)

 * Response Body: 
 
```json
[
 {
  "image_url":"http://gamma-asus.s3.aws.amazon/image555",
  "target_url":"http://loja.asus.com.br/zenfone2"
 },
 {
  "image_url":"http://gamma-asus.s3.aws.amazon/image999",
  "target_url":"http://loja.asus.com.br/notebook"
 }
]
```

**404 - Not Found**

 * **Cause**:  The game wasn't found
     * Response body: `{"detail": "Game not found."}`



### Campaign 
------

#### Get opened campaigns

This services should be used to get opened campaigns that should be executed according the app and the region where user is.

**Path**: /gmm/mobile/v1/game/_{serviceId}_/campaign.opened

**Method**: GET

**Headers**:

 * X-Token: {security API token}
 * X-Env: JSON ([user's environment data](#users-environment-data))

###### Response Status 
**200 - OK** (response body contains a campaigns list  that should be empty if there is no campaign)

 * **Response Body**:  
 
```json
[
  {
    "id": 1,
    "name": "Christmas Campaign",
    "begin_date": "2015-12-20T00:00:00Z",
    "end_date": "2015-12-25T23:59:59Z",
    "rule": {
        "custom_field1": "custom_value1",
        "custom_field2": "custom_value2"
        ...
    }
  }
]
```
 
**404 - Not Found**

 * **Cause**: Game not found
     * Response body: `{"detail": "Game not found."}`


#### Register Participant 

Register the participant in campaign by game. <br/>
**Path**: /gmm/mobile/v1/game/_{serviceId}_/campaign/_{campaign_id}_/register

**Method**: POST

**Headers**:

 * X-Token: {security API token}
 * X-Env: JSON ([user's environment data](#users-environment-data))

**Data**: JSON (following the format bellow)

```json
{
    "player": {
         "email": "asus@embedded.ufcg.edu.br",
         "gpg_id": "45u5GPG1D",
         "gcm_id": "MyGCM1D"
    }
}
```

###### Response Status 
**201 - Create**

**403 - Forbidden**

 * **Cause**: The campaign is finished
     * Response body: `{"detail": "The campaign is not open."}`

**404 - Not Found**

 * **Cause**: Game or Campaign not found
     * Response body: `{"detail": "Game or Campaign not found."}`
     
 * **Cause**: The device user aren't registered 
     * Response body: `{"detail": "Player not found."}`
     
**409 - Conflict**

 * **Cause**: Participant is already registered in campaign for this game.
     * Response body: `{"detail": "Player already registered."}`


#### Get registered Participant 

Consult the participant status in campaign by game. <br/>
**Path**: /gmm/mobile/v1/game/_{serviceId}_/campaign/_{campaign_id}_/register/_{email}_

**Method**: GET

**Headers**:

 * X-Token: {security API token}
 * X-Env: JSON ([user's environment data](#users-environment-data))
 
###### Response Status 
**200 - OK** (response body contains the participant and campaign status)

 * register: if the participant is already registered, *json* object  with register information, else, *null*.
 * opened: returns *true* or *false*, if the campaign is open or not at the moment.
 * **Response Body** (when status 200):  
 
```json
    {
        "register": {
            "date": "2015-12-21T21:01:44Z",
            "info": null,
            "email": "asus@embedded.ufcg.edu.br",
            "gpg_id": "45u5GPG1D"
        },
        "opened": true
    }
```

**404 - Not Found** 
 
 * **Cause**: Game or Campaign not found
     * Response body:
       `{"detail": "Game or Campaign not found."}`
