from gmm_region.models import Country, Region
from scripts import util
from scripts.util import create_region


def data_region(i):
    return {
        "name": "Region " + str(i),
        "countries": [{
            "country_name": "Brazil",
            "country_code": "BR"
        }, {
            "country_name": "Germany",
            "country_code": "DE"
        }]}


def run(total_regions=500):
    total = 0
    country_br = Country.manager.get(country_code="BR", country_name="Brazil")
    country_us = Country.manager.get(country_code="US", country_name="United States")

    for i in range(total_regions):
        region = create_region(name="RegionCreated" + str(i))
        region.countries.add(country_br)
        region.countries.add(country_us)

        total = util.update_progress(total, total_regions)
