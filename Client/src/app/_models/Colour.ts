export class Colour {
  public static getColour(value: number) {
      if (value >= 80)
        return '#0a1b37';
      else if (value >= 70)
        return '#213f85';
      else if (value >= 60)
        return '#588bca';
      else if (value >= 50)
        return '#afb9f1';
      else if (value >= 40)
        return '#f3c8db';
      else if (value >= 30)
        return '#fe8a87';
      else if (value >= 20)
        return '#e33940';
      else
        return '#c20000';
  }

  public static getColourDomain(): number[] {
    return [0, 20, 30, 40, 50, 60, 70, 80];
  }

  public static getColourDomainLabels(): string[] {
    return ['<20', '20+', '30+', '40+', '50+', '60+', '70+', '>80'];
  }

  public static getColours(): string[] {
    return ['#c20000', '#e33940', '#fe8a87', '#f3c8db', '#afb9f1', '#588bca', '#213f85', '#0a1b37'];
  }
}
