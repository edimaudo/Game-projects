using UnityEngine;
using System.Collections;
using UnityStandardAssets._2D;


public class EndGameTrigger : MonoBehaviour {
	public int levelNum;
	public bool finalLevel;
	public GameObject playAgainButton;
	public GameObject endLevelText;

	private Platformer2DUserControl playerControl;
	private Animator anim;

		// Use this for initialization
	void Start () {
		GameObject player = GameObject.FindGameObjectWithTag ("Player");
		playerControl = player.GetComponent<Platformer2DUserControl> ();
		anim = player.GetComponent<Animator> ();
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnTriggerEnter2D(Collider2D other) {
		if (other.tag == "Player") 
		{
			playerControl.movementEnabled = false;
			anim.speed = 0;
			endLevelText.SetActive(true);
			if(finalLevel)
			{
				playAgainButton.SetActive(true);
			}
			else{
				StartCoroutine("jumpToNextLevel");
			}
		}
	}
	//restart game
	public void restartGame()
	{
		Application.LoadLevel("Level1");


	}

	IEnumerator jumpToNextLevel()
	{
		yield return new WaitForSeconds (2.0f);
		Application.LoadLevel("Level"+levelNum);

	}
}
