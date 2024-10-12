class Onion_Rings:
    def __init__(self, config):
        # 0 = small, 1 = large
        if 'l' in config:
           self.size = 'l'
        else:
           self.size = 's'

    def __str__(self):
     return self.menu_text()

    def menu_text(self):
       return_str = "ON RING"
       if self.size == 's':
         return_str = return_str + "\n\tSML"
       elif self.size == 'l':
         return_str = return_str + "\n\tLRG"
       return return_str