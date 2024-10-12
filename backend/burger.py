class Burger:
    def __init__(self, specs):

        self.lettuce = 'l' not in specs
        self.tomato = 't' not in specs
        self.onion = 'o' not in specs
        self.cheese = 'c' not in specs
        self.sauce = 's' not in specs

    def __str__(self):
     return "foo"
    
    def menu_text(self):
       return_str = "BURGR"
       if not self.lettuce:
          return_str = return_str + "\n\tNO LTCE"
       if not self.tomato:
          return_str = return_str + "\n\tNO TOMTO"
       if not self.onion:
          return_str = return_str + "\n\tNO ONION"
       if not self.cheese:
          return_str = return_str + "\n\tNO CHEES"
       if not self.sauce:
          return_str = return_str + "\n\tNO SAUS"
       return return_str