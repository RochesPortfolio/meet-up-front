// types/GoogleUserDTO.ts
export class GoogleUserDTO {
    public iss: string;
    public azp: string;
    public aud: string;
    public sub: string;
    public email: string;
    public email_verified: boolean;
    public nbf: number;
    public name: string;
    public picture: string;
    public given_name: string;
    public family_name: string;
    public iat: number;
    public exp: number;
    public jti: string;
  
    constructor(
      iss: string,
      azp: string,
      aud: string,
      sub: string,
      email: string,
      email_verified: boolean,
      nbf: number,
      name: string,
      picture: string,
      given_name: string,
      family_name: string,
      iat: number,
      exp: number,
      jti: string
    ) {
      this.iss = iss;
      this.azp = azp;
      this.aud = aud;
      this.sub = sub;
      this.email = email;
      this.email_verified = email_verified;
      this.nbf = nbf;
      this.name = name;
      this.picture = picture;
      this.given_name = given_name;
      this.family_name = family_name;
      this.iat = iat;
      this.exp = exp;
      this.jti = jti;
    }
  }