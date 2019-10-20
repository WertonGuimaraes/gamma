from gcm.gcm import GCM
from gmm_util.constants import Constants
from gmm_util.field import Field


def send_push(api_key, data):
    response_list = {Field.SUCCESS: {}, Field.ERRORS: {}}

    for key in api_key:
        try:
            gcm = GCM(key)
            total_of_gcm_ids = len(api_key[key])
            start = 0
            end = 1000

            if total_of_gcm_ids >= Constants.LIMIT_OF_PLAYERS_TO_SEND_PUSH:
                while total_of_gcm_ids > 0:
                    response = gcm.json_request(registration_ids=api_key[key][start:end], data=data)
                    response_list = list_results_from_push_notification_response(response=response,
                                                                                 response_list=response_list)
                    start = end
                    end += Constants.LIMIT_OF_PLAYERS_TO_SEND_PUSH
                    total_of_gcm_ids -= Constants.LIMIT_OF_PLAYERS_TO_SEND_PUSH

            else:
                response = gcm.json_request(registration_ids=api_key[key], data=data)
                response_list = list_results_from_push_notification_response(response=response,
                                                                             response_list=response_list)
        except Exception:
            response_list = push_notification_exception_treatment(response_list, api_key[key])
    return response_list


def push_notification_exception_treatment(response_list, gcm):
    if Constants.FAIL in response_list[Field.ERRORS]:
        response_list[Field.ERRORS][Constants.FAIL].append(gcm)
    else:
        response_list[Field.ERRORS][Constants.FAIL] = gcm
    return response_list


def list_results_from_push_notification_response(response, response_list):
    if Field.SUCCESS in response:
        response_list[Field.SUCCESS].update(response[Field.SUCCESS])

    if Field.ERRORS in response:
        for error in response[Field.ERRORS]:
            if error in response_list[Field.ERRORS]:
                for gcm_id in response[Field.ERRORS][error]:
                    response_list[Field.ERRORS][error].append(gcm_id)
            else:
                response_list[Field.ERRORS][error] = response[Field.ERRORS][error]
    return response_list
