from backend.burger import Burger
from backend.fries import Fries
from backend.onion_rings import Onion_Rings
from backend.shake import Shake


class Order:
    def __init__(self):
        self.items = []
    def add_to_order(self, specs):
        for item in specs:
            if "burger" in item:
                self.items.add(Burger(item[6:]))
            if "shake" in item:
                self.items.add(Shake(item[5:]))
            if "fries" in item:
                self.items.add(Fries(item[5:]))
            if "onion rings" in item:
                self.items.add(Onion_Rings(item[11:]))