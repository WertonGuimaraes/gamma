from gmm_push_notification.models import Push
from tqdm import tqdm


def run(lol=1000):
    for i in tqdm(range(200)):
        data = {"data": "{'message': 'default_message'}", "query": "{'games': '" + str(i) + "'}"}
        push = Push(**data)
        push.save()
