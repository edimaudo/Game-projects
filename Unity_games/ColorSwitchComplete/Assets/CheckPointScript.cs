using UnityEngine;
using System.Collections;

public class CheckPointScript : MonoBehaviour {

	public int scoreAmount = 1;

	void OnTriggerEnter2D(Collider2D other) {
		if (other.gameObject.tag == "Player") {
			ManagerReferences refs = GameObject.Find ("Manager").GetComponent<ManagerReferences> ();
			refs.IncreaseScore(scoreAmount);
			this.gameObject.SetActive (false);
			Destroy (this);
		}
	}
}
