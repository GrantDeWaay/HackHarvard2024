class Fries:
    def __init__(self, specs):
        self.total_string = specs
        if 's' in specs:
           self.size = 's'
        elif 'l' in specs:
           self.size = 'l'
        else:
           self.size = 'm'
        

    def __str__(self):
        return "fries "+self.total_string

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