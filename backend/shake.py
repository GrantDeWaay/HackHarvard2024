class Shake:
    def __init__(self, specs):
        self.total_string = specs
        if 'l' in specs:
            self.size = 'l'
        else:
            self.size = 's'
        # 0 = choco, 1 = vanilla, 2 = strawberry
        if 'v' in specs:
            self.flavor = 'v'
        elif 'S' in specs:
            self.flavor = 'S'
        else:
            self.flavor = 'c'

    def __str__(self):
        return "shake " + self.total_string

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