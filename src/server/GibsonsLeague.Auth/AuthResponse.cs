namespace GibsonsLeague.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = "";
        public string IdToken { get; set; } = "";
        public string RefreshToken { get; set; } = "";
        public int ExpiresIn { get; set; } = 0;
        public string Username { get; set; } = "";
        public string? Error { get; set; }
    }
}
