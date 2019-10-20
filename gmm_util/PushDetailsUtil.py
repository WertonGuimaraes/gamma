from gmm_util.field import Field


class PushDetailsUtil(object):

    def save_push_details(self, devices_users, response_push, push, push_details_instance):
        push_detail = None
        for dev in devices_users:
            status = dev.gcm_id in response_push[Field.SUCCESS]
            push_detail = push_details_instance(push=push, game=dev.game, email=dev.email, status=status,
                                                gcm_id=dev.gcm_id, gpg_id=dev.gpg_id)
            push_detail.save()
        return push_detail
