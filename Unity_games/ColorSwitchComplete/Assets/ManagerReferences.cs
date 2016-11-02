using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public enum ColorUsed {
	Red,
	Yellow,
	Green,
	Blue,
	Purple
}
public class ManagerReferences : MonoBehaviour {

	public bool gameIsON = false;
	public GameObject PlayerSphere;
	public GameObject MainPanel;
	public GameObject GameOverPanel;

	public Color[] Colors;

	public int score = 0;
	public Text scoreText;
	public GameObject instructions;

	float initialGravity = 1;

	// Use this for initialization
	void Start () {
		FreezePlayerSphere ();
		instructions.SetActive (false);
		GameOverPanel.SetActive (false);
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void IncreaseScore(int amount){
		score += amount;
		scoreText.text = score.ToString ();
		// todo: play a sound effect (score up!)
	}


	public void SwitchPlayerColor(ColorUsed newColor){
		SpriteRenderer renderer = PlayerSphere.GetComponent<SpriteRenderer> ();
		switch (newColor) {
		case ColorUsed.Red:
			renderer.color = Colors [0];
			break;

		case ColorUsed.Yellow:
			renderer.color = Colors [1];
			break;

		case ColorUsed.Green:
			renderer.color = Colors [2];
			break;

		case ColorUsed.Blue:
			renderer.color = Colors [3];
			break;

		case ColorUsed.Purple:
			renderer.color = Colors [4];
			break;

		default:
			renderer.color = Colors [0];
			break;
		}
		//PlayerSphere
	}

	public void PressedPlayButton(){
		MainPanel.SetActive(false);
		gameIsON = true;
		instructions.SetActive (true);
		GameOverPanel.SetActive (false);
	}

	public void FreezePlayerSphere(){
		Rigidbody2D body = PlayerSphere.GetComponent<Rigidbody2D>();
		initialGravity = body.gravityScale;
		body.gravityScale = 0;
		//body.Sleep();
		body.isKinematic = true;

	}

	public void UnfreezePlayerSphere(){
		Rigidbody2D body = PlayerSphere.GetComponent<Rigidbody2D>();
		body.gravityScale = initialGravity;
		body.isKinematic = false;
		instructions.SetActive (false);

	}

	public void ShowGameOverPanel(){
		Rigidbody2D body = PlayerSphere.GetComponent<Rigidbody2D>();
		body.isKinematic = true;
		GameOverPanel.SetActive (true);
		gameIsON = false;
	}

	public void PressedRestartButton(){
		SceneManager.LoadScene ("main");
	}
}
