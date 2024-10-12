class Fries:
    def __init__(self, config):
        # 0 = small, 1 = medium, 2 = large
        if 's' in config:
           self.size = 's'
        elif 'l' in config:
           self.size = 'l'
        else:
           self.size = 'm'
        

    def __str__(self):
      return self.menu_text()

    def menu_text(self):
       return_str = ""
       if self.size == 's':
          return_str = return_str + "SML"
       elif self.size == 'm':
          return_str = return_str + "MED"
       elif self.size == 'l':
          return_str = return_str + "LRG"
       return_str = return_str + " FRIES"
       return return_str