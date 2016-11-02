using UnityEngine;
using System.Collections;

public class ColorSwitcherScript : MonoBehaviour {

	public ColorUsed[] allowedColors;

	void OnTriggerEnter2D(Collider2D other) {
		if (other.gameObject.tag == "Player") {
			ManagerReferences refs = GameObject.Find ("Manager").GetComponent<ManagerReferences> ();

			int index = Random.Range (0, allowedColors.Length - 1);
			ColorUsed newColor = allowedColors [index];

			refs.SwitchPlayerColor (newColor);
			this.gameObject.SetActive (false);
			Destroy (this);
		}
	}

}
