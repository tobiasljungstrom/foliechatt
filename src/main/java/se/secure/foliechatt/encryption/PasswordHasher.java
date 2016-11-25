package se.secure.foliechatt.encryption;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

public class PasswordHasher {

    private int iterations;
    private String salt;
    private String hash;

    public void generatePasswordHash(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
        iterations = 1000;
        char[] chars = password.toCharArray();
        byte[] saltBytes = doSalt();

        PBEKeySpec spec = new PBEKeySpec(chars, saltBytes, iterations, 64 * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] hashBytes = skf.generateSecret(spec).getEncoded();

        salt = toHex(saltBytes);
        hash = toHex(hashBytes);

    }

    private byte[] doSalt() throws NoSuchAlgorithmException
    {
        SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[32];
        sr.nextBytes(salt);
        return salt;
    }

    private static String toHex(byte[] array) throws NoSuchAlgorithmException
    {
        BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);
        int paddingLength = (array.length * 2) - hex.length();
        if(paddingLength > 0)
        {
            return String.format("%0"  +paddingLength + "d", 0) + hex;
        }else{
            return hex;
        }
    }

    public int getIterations() {
        return iterations;
    }

    public String getHash() {
        return hash;
    }

    public String getSalt(){
        return salt;
    }
}
