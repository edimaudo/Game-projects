using UnityEngine;
using System.Collections;

public class RotationMovementScript : MonoBehaviour {

	public float RotationSpeed = 1;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {

		Vector3 vec = new Vector3 (0, 0, RotationSpeed);  
		this.transform.Rotate (vec);
	
	}
}
