package nikolaichuks.teleconnect.backend.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import lombok.Getter;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;

/*
 * Service for generating and validating JWT tokens
 */
@Getter
@Service
public class JwtService {

    private static final String ISSUER = "tele-connect-service";

    @Value("${security.jwt.secret-key}")
    private String accessTokenSecretKey;
    @Value("${security.jwt.refresh-secret-key}")
    private String refreshTokenSecretKey;
    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;
    @Value("${security.jwt.refresh-expiration-time}")
    private long refreshJwtExpiration;

    public String generateToken(UserDetails userDetails, HashMap<String, String> claims) {
        return Jwts
                .builder()
                .setIssuer(ISSUER)
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(accessTokenSecretKey), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return Jwts
                .builder()
                .setIssuer(ISSUER)
                .setClaims(new HashMap<>())
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshJwtExpiration))
                .signWith(getSignInKey(refreshTokenSecretKey), SignatureAlgorithm.HS512)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        var claims = extractAllClaims(token, accessTokenSecretKey);
        final String username = claims.getSubject();
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(claims);
    }

    public String extractUsername(String token) {
        var claims = extractAllClaims(token, accessTokenSecretKey);
        return claims.getSubject();
    }

    public Date extractExpiryDate(String token) {
        var claims = extractAllClaims(token, accessTokenSecretKey);
        return claims.getExpiration();
    }

    public boolean isRefreshTokenValid(String token, UserDetails userDetails) {
        var claims = extractAllClaims(token, refreshTokenSecretKey);
        final String username = claims.getSubject();
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(claims);
    }

    public Date extractRefreshTokenExpiryDate(String token) {
        var claims = extractAllClaims(token, accessTokenSecretKey);
        return claims.getExpiration();
    }

    public String extractRefreshTokenUsername(String token) {
        var claims = extractAllClaims(token, refreshTokenSecretKey);
        return claims.getSubject();
    }

    private boolean isTokenExpired(Claims claims) {
        claims.getExpiration();
        return claims.getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token, String key) {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(key);
            Key signInKey = Keys.hmacShaKeyFor(keyBytes);

            return Jwts
                    .parserBuilder()
                    .setSigningKey(signInKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SecurityException ex) {
            throw new CustomRestException("Provided key is invalid.", HttpStatus.UNAUTHORIZED);
        }
    }

    private Key getSignInKey(String key) {
        byte[] keyBytes = Decoders.BASE64.decode(key);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
