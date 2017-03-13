import static org.junit.Assert.*;

import java.util.Random;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import junit.framework.Assert;

/**
 * 
 */

/**
 * @author Iain
 *
 */
public class Registration_Tests {

	
	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() {
		driver.navigate().to("localhost:3000");
		driver.findElement(By.xpath("//*[@id=\"home_background\"]/div/a[3]/span")).click();
		firstName_in = driver.findElement(By.xpath("//*[@id=\"log_in_background\"]/div/div[2]/form/div/div[1]/input"));
		lastName_in  =  driver.findElement(By.xpath("//*[@id=\"log_in_background\"]/div/div[2]/form/div/div[2]/input"));
		email_in     = driver.findElement(By.xpath("//*[@id=\"log_in_background\"]/div/div[2]/form/div/div[3]/input"));
		password_in  = driver.findElement(By.xpath("//*[@id=\"log_in_background\"]/div/div[2]/form/div/div[4]/input"));
		confirm_in   = driver.findElement(By.xpath("//*[@id=\"log_in_background\"]/div/div[2]/form/div/div[5]/input"));
		signUp_btn   = driver.findElement(By.xpath("//*[@id=\"log_in_background\"]/div/div[2]/form/button"));
	}

	/**
	 * @throws java.lang.Exception
	 */
	@After
	public void tearDown() {
		driver.close();
	}

	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * for an email associated with an existing account.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test
	public void Test_accountAlreadyExists() {
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		// input details of an existing account and submit
		populateFields("Iain", "Davis", "prodigalSourcerer@gmail.com", "123", "123");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "Email is already registered to another account";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	
	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when password and confirm password fields do not match.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test
	public void Test_unmatchingPasswords() {
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		// input details of an existing account and submit
		populateFields("Dr. Wilhelm J.", "Examplepants", "wje@barnumandbailey.gov", "123", "125");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "Passwords do not match";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	
	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when the password has fewer than 6 characters.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test(expected = AssertionError.class)
	public void Test_passwordLengthLessThan6()
	{
		// at the time of writing this test, it will fail, and an account will be created
		// therefore, usernames will be randomly generated for this test to avoid having to
		// delete the user from the database each time the test is run. The string "testuser"
		// prefixes each randomly-generated last name so that they can be found later for deletion.
		
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		String lname = "testuser" + random.nextInt();
		// input details of an existing account and submit
		populateFields("Testy", 
						lname, 
						lname + "@sample.com", "12345", "12345");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "The password must be at least 6 characters long";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	
	
	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when the password has fewer than 8 characters.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test(expected = AssertionError.class)
	public void Test_passwordLengthLessThan8()
	{
		// at the time of writing this test, it will fail, and an account will be created
		// therefore, usernames will be randomly generated for this test to avoid having to
		// delete the user from the database each time the test is run. The string "testuser"
		// prefixes each randomly-generated last name so that they can be found later for deletion.
		
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		String lname = "testuser" + random.nextInt();
		// input details of an existing account and submit
		populateFields("Testy", 
						lname, 
						lname + "@sample.com", "1234567", "1234567");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "The password must be at least 8 characters long";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	

	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when the password has no numerals.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test(expected = AssertionError.class)
	public void Test_passwordHasNoNumerals()
	{
		// at the time of writing this test, it will fail, and an account will be created
		// therefore, usernames will be randomly generated for this test to avoid having to
		// delete the user from the database each time the test is run. The string "testuser"
		// prefixes each randomly-generated last name so that they can be found later for deletion.
		
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		String lname = "testuser" + random.nextInt();
		// input details of an existing account and submit
		populateFields("Testy", 
						lname, 
						lname + "@sample.com", "@brahamLinkin", "@brahamLinkin");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "The password must contain at least one number";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	
	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when the password contains no lower case letters.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test(expected = AssertionError.class)
	public void Test_passwordNoLowerCase()
	{
		// at the time of writing this test, it will fail, and an account will be created
		// therefore, usernames will be randomly generated for this test to avoid having to
		// delete the user from the database each time the test is run. The string "testuser"
		// prefixes each randomly-generated last name so that they can be found later for deletion.
		
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		String lname = "testuser" + random.nextInt();
		// input details of an existing account and submit
		populateFields("Testy", 
						lname, 
						lname + "@sample.com", "@BRAHAMLINKIN1", "@BRAHAMLINKIN1");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "The password must contain at least one lowercase letter";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	
	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when the password contains no upper case letters.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test(expected = AssertionError.class)
	public void Test_passwordNoUpperCase()
	{
		// at the time of writing this test, it will fail, and an account will be created
		// therefore, usernames will be randomly generated for this test to avoid having to
		// delete the user from the database each time the test is run. The string "testuser"
		// prefixes each randomly-generated last name so that they can be found later for deletion.
		
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		String lname = "testuser" + random.nextInt();
		// input details of an existing account and submit
		populateFields("Testy", 
						lname, 
						lname + "@sample.com", "@brahamlinkin1", "@brahamlinkin1");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "The password must contain at least one uppercase letter";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	
	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when the password contains no special characters.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test(expected = AssertionError.class)
	public void Test_passwordNoSpecialCharacters()
	{
		// at the time of writing this test, it will fail, and an account will be created
		// therefore, usernames will be randomly generated for this test to avoid having to
		// delete the user from the database each time the test is run. The string "testuser"
		// prefixes each randomly-generated last name so that they can be found later for deletion.
		
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		String lname = "testuser" + random.nextInt();
		// input details of an existing account and submit
		populateFields("Testy", 
						lname, 
						lname + "@sample.com", "4brahamLinkin", "4brahamLinkin");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "The password must contain at least one lowercase letter";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	
	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when the email does not contain an @ symbol.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test
	public void Test_emailNoAtSymbol()
	{
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		String lname = "testuser" + random.nextInt();
		// input details of an existing account and submit
		populateFields("Testy", 
						lname, 
						lname + ".at.sample.com", "@brahamL1nk1n", "@brahamL1nk1n");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "Email is not valid";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	

	/**
	 * Test whether PinPin correctly rejects attempts to register an account
	 * when the email has no domain.
	 * @author  Iain
	 * @version 1.0
	 */
	@Test
	public void Test_emailNoDomain()
	{
		// confirm no error message present at start
		assertEquals(0, driver.findElements(By.id("flash-message")).size());
		
		// get the URL of the current page
		String before = new String(driver.getCurrentUrl());
		
		String lname = "testuser" + random.nextInt();
		// input details of an existing account and submit
		populateFields("Testy", 
						lname, 
						lname + "@sample", "@brahamL1nk1n", "@brahamL1nk1n");
		signUp_btn.click();
		
		// get the URL of the page we've 'linked' to. (It should be the same page);
		String after = new String(driver.getCurrentUrl());
		
		// confirm we are on the same page
		assertEquals(before, after);
		
		// check for the pop-up message and make sure it says something useful.
		assertEquals(1, driver.findElements(By.id("flash-message")).size());
		String expected = "Email is not valid";
		assertEquals(expected, driver.findElement(By.id("flash-message")).getText());
	}
	
	
	
	/**
	 * Method parameterizes the input fields on the registration screen
	 * @param fname		first name to associate with the requested account
	 * @param lname		last name to associate with the requested account
	 * @param email		email address to associate with the requested account
	 * @param password	the password to associate with the requested account
	 * @param confirm	the password repeated to check for errors
	 */
	public void populateFields(String fname, String lname, 
							   String email, String password, 
							   String confirm)
	{
		firstName_in.sendKeys(fname);
		lastName_in.sendKeys(lname);
		email_in.sendKeys(email);
		password_in.sendKeys(password);
		confirm_in.sendKeys(confirm);
	}
	Random random = new Random();
	final WebDriver driver  = new ChromeDriver();
	WebElement firstName_in;
	WebElement lastName_in;
	WebElement email_in;
	WebElement password_in;
	WebElement confirm_in;
	WebElement signUp_btn;
	
}
