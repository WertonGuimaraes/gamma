

class ApiKeyUtil(object):

    def extract_api_key_from_devices(self, devices):
        api_key = {}
        if devices:
            for dev in devices:
                if dev.game.api_key not in api_key:
                    api_key[dev.game.api_key] = []
                api_key[dev.game.api_key].append(dev.gcm_id)
        return api_key
