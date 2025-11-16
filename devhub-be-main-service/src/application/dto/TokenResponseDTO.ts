// DTO for JWT token response
export interface TokenResponseDTO {
  accessToken: string
  refreshToken?: string
  expiresIn: string
  user: {
    id: number
    email: string
    name: string
    role: string
  }
}
