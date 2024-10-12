class Onion_Rings:
    def __init__(self, specs):
        # 0 = small, 1 = large
        self.total_string = specs
        if 'l' in specs:
           self.size = 'l'
        else:
           self.size = 's'

    def __str__(self):
        return "onion rings " + self.total_string

    def menu_text(self):
       return_str = "ON RING"
       if self.size == 's':
         return_str = return_str + "\n\tSML"
       elif self.size == 'l':
         return_str = return_str + "\n\tLRG"
       return return_str