class Shake:
    def __init__(self, config):
        # 0 = small, 1 = large
        if 'l' in config:
            self.size = 'l'
        else:
            self.size = 's'
        # 0 = choco, 1 = vanilla, 2 = strawberry
        if 'v' in config:
            self.flavor = 'v'
        elif 'S' in config:
            self.flavor = 'S'
        else:
            self.flavor = 'c'

    def __str__(self):
        return self.menu_text()

    def menu_text(self):
        return_str = "SHAKE"
        if self.size == 's':
            return_str = return_str + "\n\tSML"
        elif self.size == 'l':
            return_str = return_str + "\n\tLRG"
        
        if self.flavor == 'c':
            return_str = return_str + "\n\tCHCL"
        elif self.flavor == 'v':
            return_str = return_str + "\n\tVNL"
        elif self.flavor == 'S':
            return_str = return_str + "\n\tSTRWBRY"
        return return_str