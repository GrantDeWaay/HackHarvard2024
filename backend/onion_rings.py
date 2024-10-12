class Onion_Rings:
    def __init__(self, size):
        # 0 = small, 1 = large
        self.size = size

    def __str__(self):
     return "foo"

    def menu_text(self):
       return_str = "ON RING"
       if self.size == 0:
         return_str = return_str + "\n\tSML"
       elif self.size == 1:
         return_str = return_str + "\n\tLRG"
       return return_str