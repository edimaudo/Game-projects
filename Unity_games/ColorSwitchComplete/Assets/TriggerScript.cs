using UnityEngine;
using System.Collections;

public class TriggerScript : MonoBehaviour {

	public ColorUsed colorIndex;

	void Start(){
		ManagerReferences refs = GameObject.Find ("Manager").GetComponent<ManagerReferences> ();
		if (refs != null) {
			Color newColor = refs.Colors [(int)colorIndex];
			gameObject.GetComponent<SpriteRenderer> ().color = newColor;
		}
	}

	void OnTriggerEnter2D(Collider2D other) {
		if (other.gameObject.tag == "Player") {
			//Debug.Log ("collision with the sphere player");
			Color playerColor = other.gameObject.GetComponent<SpriteRenderer> ().color;
			Color thisColor = this.gameObject.GetComponent<SpriteRenderer> ().color;

			if (playerColor != thisColor) {
				// todo: GAME OVER
				Debug.Log("GAME OVER");
				ManagerReferences refs = GameObject.Find ("Manager").GetComponent<ManagerReferences> ();
				if (refs != null) {
					refs.ShowGameOverPanel ();
				}
			}
		}
	}
}
