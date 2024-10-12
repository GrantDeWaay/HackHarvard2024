class Shake:
    def __init__(self, size, flavor):
        # 0 = small, 1 = large
        self.size = size
        # 0 = choco, 1 = vanilla, 2 = strawberry
        self.flavor = size

    def __str__(self):
     return "foo"

    def menu_text(self):
        return_str = "SHAKE"
        if self.size == 0:
            return_str = return_str + "\n\tSML"
        elif self.size == 1:
            return_str = return_str + "\n\tLRG"
        if self.flavor == 0:
            return_str = return_str + "\n\tCHCLT"
        elif self.flavor == 1:
            return_str = return_str + "\n\tVNL"
        elif self.flavor == 2:
            return_str = return_str + "\n\tSTRWBRY"
        return return_str