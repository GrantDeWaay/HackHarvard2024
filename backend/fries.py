class Fries:
    def __init__(self):
        # 0 = small, 1 = medium, 2 = large
        size = 0

    def __str__(self):
     return "foo"

    def menu_text(self):
       return_str = ""
       if self.size == 0:
          return_str = return_str + "SML"
       elif self.size == 1:
          return_str = return_str + "MED"
       elif self.size == 2:
          return_str = return_str + "LRG"
       return_str = return_str + " FRIES"
       return return_str