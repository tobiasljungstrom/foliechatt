package se.secure.foliechatt.domain;


import java.util.ArrayList;
import java.util.List;


public final class UserManager {
    private static List<LoggedInUser> loggedInUsers = new ArrayList<>();
//    private static Map<User, String>  = new HashMap<>();
    private UserManager() {
    }


    public static User getUserBySessionToken(String sessionToken) {
        if (indexOfSessionTokenInLoggedInUser(sessionToken) > -1) {
            return loggedInUsers.get(indexOfSessionTokenInLoggedInUser(sessionToken)).getUser();
        }
        return null;
    }

    public static Boolean isUserInSession(User user, String sessionToken) {
        int index = indexOfLoggedInUser(user);
        return index > -1 && loggedInUsers.get(index).getSessionToken().equals(sessionToken);
    }

    public static int indexOfLoggedInUser(User user) {
        for (LoggedInUser lu: loggedInUsers) {
            if (lu.getUser().equals(user)){
                return loggedInUsers.indexOf(lu);
            }
        }
        return -1;
    }

    private static int indexOfSessionTokenInLoggedInUser(String sessionToken) {
        for (LoggedInUser lu: loggedInUsers) {
            if (lu.getSessionToken().equals(sessionToken)){
                return loggedInUsers.indexOf(lu);
            }
        }
        return -1;
    }

    public static Boolean removeLoggedInUser (User user){
        int userIndex = indexOfLoggedInUser(user);
        if (userIndex > -1){
            loggedInUsers.remove(userIndex);
            return true;
        }
        return false;
    }

    public static void setLoggedInUser(int userIndex, LoggedInUser loggedInUser) {
        loggedInUsers.set(userIndex, loggedInUser);
    }

    public static void addLoggedInUser (LoggedInUser loggedInUser){
        loggedInUsers.add(loggedInUser);
    }

}
