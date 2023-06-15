export class UserEntity {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role.toLowerCase();
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
