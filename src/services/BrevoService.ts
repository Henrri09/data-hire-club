export default class BrevoService {
  private static readonly API_KEY = import.meta.env.VITE_BREVO_API_KEY;

  public static async createContact(email: string, firstName: string, lastName: string, externalId: string) {
    const response = await fetch(`https://api.brevo.com/v3/contacts`, {
      method: 'POST',
      headers: {
        'api-key': this.API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: {
          FNAME: firstName,
          LNAME: lastName,
        },
        ext_id: externalId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create contact');
    }

    return response.json();
  }
}